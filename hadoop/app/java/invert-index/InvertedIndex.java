import java.io.IOException;
import java.util.StringTokenizer;
import java.util.HashMap;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;
import org.json.JSONObject;

public class InvertedIndex extends Configured implements Tool {
    public static class TokenizerMapper extends Mapper<Object, Text, Text, Text> {
        private Text word = new Text();

        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            try {
                JSONObject json = new JSONObject(value.toString());
                String docId = json.getString("id");
                String text = json.getString("text");

                StringTokenizer tokenizer = new StringTokenizer(text, " \n\r\t.,!?:()[]{};\\/\"*");

                while (tokenizer.hasMoreTokens()) {
                    String token = tokenizer.nextToken().replaceAll("[^a-zA-Z]", "").toLowerCase();
                    if (!token.isEmpty()) {
                        word.set(token);
                        context.write(word, new Text(docId));
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public static class IntSumReducer extends Reducer<Text, Text, Text, Text> {
        public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
            HashMap<String, Integer> map = new HashMap<String, Integer>();

            for (Text val : values) {
                String docId = val.toString();

                if (map.containsKey(docId)) {
                    map.put(docId, map.get(docId) + 1);
                } else {
                    map.put(docId, 1);
                }
            }

            StringBuilder docValueList = new StringBuilder();
            for (String docID : map.keySet()) {
                docValueList.append(docID + ":" + map.get(docID) + " ");
            }

            context.write(key, new Text(docValueList.toString()));
        }
    }

    public int run(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
        Job job = Job.getInstance(getConf(), "inverted index");
        job.setJarByClass(InvertedIndex.class);
        job.setMapperClass(TokenizerMapper.class);
        job.setReducerClass(IntSumReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));
        return job.waitForCompletion(true) ? 0 : 1;
    }

    public static void main(String[] args) throws Exception {
        int exitCode = ToolRunner.run(new InvertedIndex(), args);
        System.exit(exitCode);
    }
}